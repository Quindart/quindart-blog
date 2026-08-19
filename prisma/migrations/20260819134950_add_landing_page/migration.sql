-- CreateTable LandingPage
CREATE TABLE "public"."LandingPage" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "images" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "keywords" TEXT[],
    "canonicalUrl" TEXT,
    "lighthouseScore" INTEGER,
    "lighthouseReport" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_slug_key" ON "public"."LandingPage"("slug");
