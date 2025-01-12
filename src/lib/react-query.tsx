"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Snowfall snowflakeCount={100} /> */}
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
