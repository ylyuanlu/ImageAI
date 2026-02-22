-- CreateTable
CREATE TABLE "CustomPose" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CUSTOM',
    "tags" TEXT,
    "prompt" TEXT,
    "source" TEXT NOT NULL DEFAULT 'TEXT',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomPose_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Generation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "modelImage" TEXT NOT NULL,
    "outfitImages" TEXT NOT NULL,
    "pose" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "lighting" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "colorTone" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "customPoseId" TEXT,
    "generatedImages" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "prompt" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Generation_customPoseId_fkey" FOREIGN KEY ("customPoseId") REFERENCES "CustomPose" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Generation" ("background", "colorTone", "completedAt", "count", "createdAt", "error", "generatedImages", "id", "lighting", "metadata", "modelImage", "outfitImages", "pose", "prompt", "status", "style", "userId") SELECT "background", "colorTone", "completedAt", "count", "createdAt", "error", "generatedImages", "id", "lighting", "metadata", "modelImage", "outfitImages", "pose", "prompt", "status", "style", "userId" FROM "Generation";
DROP TABLE "Generation";
ALTER TABLE "new_Generation" RENAME TO "Generation";
CREATE INDEX "Generation_customPoseId_idx" ON "Generation"("customPoseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CustomPose_userId_idx" ON "CustomPose"("userId");

-- CreateIndex
CREATE INDEX "CustomPose_createdAt_idx" ON "CustomPose"("createdAt");
