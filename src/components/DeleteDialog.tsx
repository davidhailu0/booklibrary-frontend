"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook, editBook as updateBook } from "@/services/bookService";

interface DeleteBookDialogProps {
  ID?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteBookDialog({
  ID,
  open,
  onOpenChange,
}: DeleteBookDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteBook } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleDelete = () => {
    mutateDeleteBook(ID!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this book?</p>
        <div className="flex justify-end gap-2 col-span-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete Book</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
