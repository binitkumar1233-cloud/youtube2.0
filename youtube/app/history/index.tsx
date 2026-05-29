import HistoryContent from "@/components/ui/HistoryContent";
import React, { Suspense, useEffect, useState } from "react";

const index = () => {
  return (
    <div>
      <div>
        <h1>Watch History</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <HistoryContent />
        </Suspense>
      </div>
    </div>
  );
};

export default index;
