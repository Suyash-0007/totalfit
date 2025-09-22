"use client";

import { useState } from "react";
import { Search, Filter, Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SearchResult = {
  id: string;
  type: "athlete" | "performance" | "finance";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

const mockResults: SearchResult[] = [
  { id: "1", type: "athlete", title: "Alex Rivera", subtitle: "Football • Age 23", icon: <Users className="h-4 w-4" /> },
  { id: "2", type: "performance", title: "Performance Report", subtitle: "Last 7 days • Steps: 85,000", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "3", type: "finance", title: "Monthly Budget", subtitle: "Income: $5,200 • Expenses: $3,100", icon: <DollarSign className="h-4 w-4" /> },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all",
    sportType: "all",
    riskLevel: "all",
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function handleSearch() {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const filtered = mockResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
  }

  function clearFilters() {
    setFilters({ dateRange: "all", sportType: "all", riskLevel: "all" });
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search athletes, reports, records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setFilters({ ...filters, dateRange: "7d" })}>
              <Calendar className="mr-2 h-4 w-4" />
              Last 7 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, dateRange: "30d" })}>
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, sportType: "football" })}>
              <Users className="mr-2 h-4 w-4" />
              Football
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, sportType: "tennis" })}>
              <Users className="mr-2 h-4 w-4" />
              Tennis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, riskLevel: "low" })}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Low Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={clearFilters}>
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      <div className="mt-2 flex flex-wrap gap-1">
        {filters.dateRange !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {filters.dateRange === "7d" ? "7 days" : "30 days"}
          </Badge>
        )}
        {filters.sportType !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {filters.sportType}
          </Badge>
        )}
        {filters.riskLevel !== "all" && (
          <Badge variant="secondary" className="text-xs">
            {filters.riskLevel} risk
          </Badge>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full z-50 mt-2 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.map((result) => (
              <div key={result.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
                {result.icon}
                <div className="flex-1">
                  <div className="text-sm font-medium">{result.title}</div>
                  <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {result.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


