"use client";

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
import { Book } from "@/lib/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBook as updateBook } from "@/services/bookService";

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function EditBookDialog({
  book,
  open,
  onOpenChange,
  onUpdate,
}: EditBookDialogProps) {
  const [editBook, setEditBook] = useState<Book>({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    coverUrl: book.coverUrl,
    rating: book.rating ?? 0,
    isRead: book.isRead,
    notes: book.notes,
  });
  const queryClient = useQueryClient();

  const { mutate: mutateEditBook } = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
  useEffect(() => {
    setEditBook({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      coverUrl: book.coverUrl,
      rating: book.rating ?? 0,
      isRead: book.isRead,
      notes: book.notes,
    });
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateEditBook(editBook);
    onUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editBook.title}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={editBook.author}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, author: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL</Label>
            <Input
              id="coverUrl"
              value={book.coverUrl}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, coverUrl: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={book.isbn}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, isbn: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditBook((prev) => ({ ...prev, rating: value }))
                  }
                >
                  <Star
                    className={`h-4 w-4 ${
                      value <= (editBook.rating ?? 0)
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
              checked={editBook.isRead}
              onCheckedChange={(checked) =>
                setEditBook((prev) => ({ ...prev, isRead: checked }))
              }
            />
            <Label htmlFor="isRead">Mark as read</Label>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editBook.notes}
              onChange={(e) =>
                setEditBook((prev) => ({ ...prev, notes: e.target.value }))
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
