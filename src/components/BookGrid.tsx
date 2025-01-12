"use client";

import { Book } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditBookDialog from "./EditBookDialog";
import DeleteBookDialog from "./DeleteDialog.tsx";
import { useState } from "react";

interface BookGridProps {
  books?: Book[];
}

export default function BookGrid({ books }: BookGridProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books?.map((book) => (
        <Card key={book.title} className="flex flex-col">
          <CardContent className="flex-1 p-6">
            <div className="aspect-[2/3] relative mb-4">
              <img
                src={
                  book.coverUrl ||
                  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
                }
                alt={book.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-muted-foreground mb-2">{book.author}</p>
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (book.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <Badge variant={book.isRead ? "default" : "secondary"}>
              {book.isRead ? "Read" : "Unread"}
            </Badge>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditingBook(book)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setDeletingBook(book)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {editingBook && (
        <EditBookDialog
          book={editingBook}
          open={!!editingBook}
          onOpenChange={() => setEditingBook(null)}
          onUpdate={() => {
            setEditingBook(null);
          }}
        />
      )}
      {deletingBook && (
        <DeleteBookDialog
          ID={deletingBook?.id}
          open={!!deletingBook}
          onOpenChange={() => setDeletingBook(null)}
        />
      )}
    </div>
  );
}
