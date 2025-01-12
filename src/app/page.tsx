"use client";

import { useState } from "react";
import { Search, Grid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookGrid from "@/components/BookGrid";
import BookList from "@/components/BookList";
import AddBookDialog from "@/components/AddBookDialog";
import { Book } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";
import { searchBook } from "@/services/bookService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function BookLibrary() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();
  const { data: books } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: () => searchBook(searchQuery!),
  });

  const filteredBooks = books?.filter((book) => {
    const query = searchQuery?.toLowerCase() || "";
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query)
    );
  });

  const handleAddBook = () => {
    setShowAddDialog(false);
  };
  const handleSearch = useDebouncedCallback(async (query?: string) => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  }, 300);

  return (
    <div className="container mx-auto px-10 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">My Book Library</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, or ISBN..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <BookGrid books={filteredBooks} />
        ) : (
          <BookList books={filteredBooks} />
        )}
      </div>

      <AddBookDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddBook}
      />
    </div>
  );
}
