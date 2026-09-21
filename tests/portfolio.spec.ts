import { expect, test } from "@playwright/test";

test.use({ launchOptions: { channel: "chrome" } });

test("landing remains usable when writing fails, with working section navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/blogs", (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Chỉn chu",
  );
  await expect(
    page.getByText("Software Engineer.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Chưa thể tải bài viết lúc này.")).toBeAttached();
  await page.getByRole("link", { name: "Khám phá dự án", exact: true }).click();
  await expect(page).toHaveURL(/#du-an$/);
  await expect(
    page.getByRole("heading", { name: "Ý tưởng thành hiện thực." }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Thử lại" }).scrollIntoViewIfNeeded();
  await expect(page.getByText("Chưa thể tải bài viết lúc này.")).toBeVisible();
  await page.route("**/api/blogs", (route) => route.fulfill({ json: [] }));
  await page.getByRole("button", { name: "Thử lại" }).click();
  await expect(
    page.getByText(/Những ghi chép mới đang được chuẩn bị/),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("published writing links remain accessible after moving the blog index", async ({
  page,
}) => {
  await page.route("**/api/blogs", (route) =>
    route.fulfill({
      json: [
        {
          id: 1,
          title: "Một bài viết công khai",
          slug: "bai-viet",
          status: "published",
          createdAt: "2026-09-20",
          excerpt: "Ghi chép thử nghiệm",
        },
        {
          id: 2,
          title: "Bản nháp chưa công khai",
          slug: "draft",
          status: "draft",
          createdAt: "2026-09-19",
        },
      ],
    }),
  );
  await page.goto("/");
  const article = page.getByRole("link", { name: /Một bài viết công khai/ });
  await article.scrollIntoViewIfNeeded();
  await expect(article).toHaveAttribute("href", "/blog/bai-viet");
  await expect(page.getByText("Bản nháp chưa công khai")).toHaveCount(0);
  await page.getByRole("link", { name: "Tất cả bài viết" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ghi chép từ công việc",
  );
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route("**/api/blogs", (route) => route.fulfill({ json: [] }));
    await page.goto("/");
    for (const section of await page.locator("main section").all()) {
      await section.scrollIntoViewIfNeeded();
    }
    await expect(
      page.getByRole("link", { name: "Kết nối qua LinkedIn" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `/tmp/quindart-portfolio-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("reduced motion and no JavaScript preserve the core portfolio", async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ý tưởng thành hiện thực." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Kết nối qua LinkedIn" }),
  ).toHaveAttribute("href", /linkedin\.com/);
  await context.close();
});
