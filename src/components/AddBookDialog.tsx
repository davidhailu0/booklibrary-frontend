"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { OpenLibraryBook } from "@/lib/types";
import { Star, Search, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { addBook, searchBookAPI } from "@/services/bookService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export default function AddBookDialog({
  open,
  onOpenChange,
  onAdd,
}: AddBookDialogProps) {
  const [book, setBook] = useState<{
    title: string;
    author: string;
    isbn: string;
    coverUrl: string;
    rating: number;
    isRead: boolean;
    notes: string;
  }>({
    title: "",
    author: "",
    isbn: "",
    coverUrl: "",
    rating: 0,
    isRead: false,
    notes: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const handleSearch = useDebouncedCallback(async (query?: string) => {
    const queryParam = query || searchQuery;
    if (!queryParam.trim() || queryParam.length < 3) return;

    setIsSearching(true);
    const params: {
      title?: string;
      author?: string;
      isbn?: string;
    } = {};
    try {
      if (/^\d+$/.test(queryParam)) {
        // Check if query is numeric (likely ISBN)
        params.isbn = query;
      } else if (queryParam.includes(" ")) {
        // Likely a title
        params.title = query;
      } else {
        // Fallback to author
        params.author = query;
      }
      const results = await searchBookAPI(params);
      setSearchResults(results.docs);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleOnUserType = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSelectBook = (book: OpenLibraryBook) => {
    setBook({
      title: book.title,
      author: book.author_name?.[0] || "",
      isbn: book.isbn?.[0] || "",
      coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
      rating: 0,
      isRead: false,
      notes: "",
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const { mutate: mutateAddBook } = useMutation({
    mutationFn: addBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
    mutateAddBook(book);
    resetForm();
  };

  const resetForm = () => {
    setBook({
      title: "",
      author: "",
      isbn: "",
      coverUrl: "",
      rating: 0,
      isRead: false,
      notes: "",
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label>Search Open Library</Label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => handleOnUserType(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {searchResults.map((book, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                  onClick={() => handleSelectBook(book)}
                >
                  <div className="font-medium">{book.title}</div>
                  {book.author_name && (
                    <div className="text-sm text-muted-foreground">
                      {book.author_name[0]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={book.title}
              onChange={(e) =>
                setBook((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={book.author}
              onChange={(e) =>
                setBook((prev) => ({ ...prev, author: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={book.isbn}
              onChange={(e) =>
                setBook((prev) => ({ ...prev, isbn: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL</Label>
            <Input
              id="coverUrl"
              value={book.coverUrl}
              onChange={(e) =>
                setBook((prev) => ({ ...prev, coverUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setBook((prev) => ({ ...prev, rating: value }))
                  }
                >
                  <Star
                    className={`h-4 w-4 ${
                      value <= book.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <Switch
              id="isRead"
              checked={book.isRead}
              onCheckedChange={(checked: boolean) =>
                setBook((prev) => ({ ...prev, isRead: checked }))
              }
            />
            <Label htmlFor="isRead">Mark as read</Label>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={book.notes}
              onChange={(e) =>
                setBook((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add your thoughts about this book..."
            />
          </div>
          <div className="flex justify-end gap-2 col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Book</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
