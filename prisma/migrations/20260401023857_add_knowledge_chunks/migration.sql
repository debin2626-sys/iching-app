-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "hexagramNumber" INTEGER NOT NULL,
    "chunkType" TEXT NOT NULL,
    "linePosition" INTEGER,
    "content" TEXT NOT NULL,
    "contentEn" TEXT,
    "metadata" JSONB NOT NULL,
    "embedding" vector(1024),
    "embeddingOpenAI" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeChunk_hexagramNumber_idx" ON "KnowledgeChunk"("hexagramNumber");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_chunkType_idx" ON "KnowledgeChunk"("chunkType");
