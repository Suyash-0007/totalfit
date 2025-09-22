"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type Deal = { id: string; sponsor: string; amount: number; status: "Active" | "Pending" | "Expired" };
type Tx = { id: string; type: "Income" | "Expense"; amount: number; category: string; note?: string; date: string };

function monthKey(d: Date) {
	return d.toLocaleString(undefined, { month: "short" }) + " " + d.getFullYear();
}

export default function FinancePage() {
	const [deals, setDeals] = useState<Deal[]>([]);
	const [transactions, setTransactions] = useState<Tx[]>([]);

	// Load persisted data
	useEffect(() => {
		const d = localStorage.getItem("finance_deals");
		const t = localStorage.getItem("finance_transactions");
		if (d) setDeals(JSON.parse(d));
		if (t) setTransactions(JSON.parse(t));
	}, []);

	useEffect(() => {
		localStorage.setItem("finance_deals", JSON.stringify(deals));
	}, [deals]);
	useEffect(() => {
		localStorage.setItem("finance_transactions", JSON.stringify(transactions));
	}, [transactions]);

	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		type: "Income" as "Income" | "Expense",
		amount: "",
		category: "Salary",
		note: "",
		date: new Date().toISOString().slice(0, 10),
	});

	const [dealForm, setDealForm] = useState({ sponsor: "", amount: "", status: "Active" as Deal["status"] });

	const monthly = useMemo(() => {
		// group last 6 months
		const now = new Date();
		const buckets: Record<string, { month: string; income: number; expenses: number }> = {};
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = monthKey(d);
			buckets[key] = { month: key, income: 0, expenses: 0 };
		}
		for (const tx of transactions) {
			const d = new Date(tx.date);
			const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
			if (!buckets[key]) continue;
			if (tx.type === "Income") buckets[key].income += tx.amount;
			else buckets[key].expenses += tx.amount;
		}
		return Object.values(buckets);
	}, [transactions]);

	const balance = useMemo(() => {
		const income = transactions.filter(t => t.type === "Income").reduce((s, t) => s + t.amount, 0);
		const expenses = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
		return { income, expenses, net: income - expenses };
	}, [transactions]);

	function removeDeal(id: string) {
		setDeals((d) => d.filter((x) => x.id !== id));
	}

	function addDeal(e: React.FormEvent) {
		e.preventDefault();
		if (!dealForm.sponsor || !dealForm.amount) return;
		setDeals(prev => [{ id: crypto.randomUUID(), sponsor: dealForm.sponsor, amount: parseFloat(dealForm.amount), status: dealForm.status }, ...prev]);
		setDealForm({ sponsor: "", amount: "", status: "Active" });
	}

	function saveTransaction() {
		if (!form.amount) return setOpen(false);
		setTransactions(prev => [{ id: crypto.randomUUID(), type: form.type, amount: parseFloat(form.amount), category: form.category, note: form.note, date: form.date }, ...prev]);
		setOpen(false);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Finance Management</h1>
					<p className="text-muted-foreground">Budgeting, deals, and transactions</p>
				</div>
				<div className="rounded-lg border px-4 py-3 text-sm shadow-sm">
					<div className="font-medium">Net Balance</div>
					<div className="tabular-nums">${balance.net.toLocaleString()}</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Monthly Income vs Expenses</CardTitle>
					</CardHeader>
					<CardContent className="h-80">
						{transactions.length === 0 ? (
							<div className="flex h-full items-center justify-center text-sm text-muted-foreground">No transactions yet. Add one to see the chart.</div>
						) : (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={monthly}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="income" fill="#22c55e" radius={[6,6,0,0]} />
								<Bar dataKey="expenses" fill="#ef4444" radius={[6,6,0,0]} />
							</BarChart>
						</ResponsiveContainer>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Sponsorship Deals</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={addDeal} className="mb-3 grid gap-2 sm:grid-cols-3">
							<Input placeholder="Sponsor" value={dealForm.sponsor} onChange={(e) => setDealForm({ ...dealForm, sponsor: e.target.value })} />
							<Input placeholder="Amount" type="number" value={dealForm.amount} onChange={(e) => setDealForm({ ...dealForm, amount: e.target.value })} />
							<Select value={dealForm.status} onValueChange={(v) => setDealForm({ ...dealForm, status: v as Deal["status"] })}>
								<SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Expired">Expired</SelectItem>
								</SelectContent>
							</Select>
							<Button type="submit">Add Deal</Button>
						</form>
						{deals.length === 0 ? (
							<div className="text-sm text-muted-foreground">No deals yet.</div>
						) : (
						<ul className="space-y-2 text-sm">
							{deals.map((d) => (
								<li key={d.id} className="flex items-center justify-between rounded-md border p-2 shadow-sm">
									<div>
										<div className="font-medium">{d.sponsor}</div>
										<div className="text-muted-foreground">${d.amount.toLocaleString()} • {d.status}</div>
									</div>
									<div className="flex gap-2">
										<Button variant="destructive" size="sm" onClick={() => removeDeal(d.id)}>Delete</Button>
									</div>
								</li>
							))}
						</ul>
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Add Transaction</CardTitle>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button size="sm">New</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Transaction</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-2">
								<div className="grid gap-2">
									<Label>Type</Label>
									<Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "Income" | "Expense" })}>
										<SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
										<SelectContent>
											<SelectItem value="Income">Income</SelectItem>
											<SelectItem value="Expense">Expense</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label>Date</Label>
									<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
								</div>
								<div className="grid gap-2">
									<Label>Amount</Label>
									<Input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
								</div>
								<div className="grid gap-2">
									<Label>Category</Label>
									<Input placeholder="Salary, Gear, Travel..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
								</div>
								<div className="grid gap-2">
									<Label>Note</Label>
									<Textarea placeholder="Optional details" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
								</div>
								<div className="flex justify-end gap-2 pt-2">
									<Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
									<Button onClick={saveTransaction}>Save</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					{transactions.length === 0 ? (
						<p className="text-sm text-muted-foreground">No transactions yet. Use the &quot;New&quot; button to add one.</p>
					) : (
						<ul className="space-y-2 text-sm">
							{transactions.map((t) => (
								<li key={t.id} className="flex items-center justify-between rounded-md border p-2">
									<div>
										<div className="font-medium">{t.type} • ${t.amount.toLocaleString()}</div>
										<div className="text-muted-foreground">{t.date} • {t.category}{t.note ? ` • ${t.note}` : ""}</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}


