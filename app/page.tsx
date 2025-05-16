import React, { Suspense } from "react";
import AiSearch from "./ai-seacrh";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <AiSearch />
    </Suspense>
  );
}
