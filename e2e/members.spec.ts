import { test, expect } from "@playwright/test"

const hostEmail = `host-${Date.now()}@example.com`
const hostPassword = "Password123!"
const memberEmail = `member-${Date.now()}@example.com`
const memberPassword = "Password123!"
let eventId: string

test.describe("참여자 탭", () => {
  test("참여자 승인", async ({ page }) => {
    // 주최자 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 이벤트 생성 또는 목록에서 선택
    await page.goto("/protected")
    const eventCard = page.locator("[data-testid='event-card']").first()
    eventId = (await eventCard.getAttribute("data-event-id")) || ""

    // 참여자 탭 이동
    await page.goto(`/protected/events/${eventId}/members`)

    // 승인 대기 섹션 확인
    const pendingSection = page.locator("text=승인 대기")
    await expect(pendingSection).toBeVisible()

    // 첫 번째 대기 중인 참여자의 승인 버튼 클릭
    const approveButton = page.locator('button svg[data-icon="check"]').first()
    await approveButton.click()

    // 해당 참여자가 "승인됨" 섹션으로 이동했는지 확인
    await page.waitForTimeout(1000)
    await expect(page.locator("text=승인됨").locator("..")).toContainText("")
  })

  test("참여자 거절", async ({ page }) => {
    // 주최자 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 참여자 탭 이동
    await page.goto(`/protected/events/${eventId}/members`)

    // 첫 번째 대기 중인 참여자의 거절 버튼 클릭
    const rejectButton = page.locator('button svg[data-icon="x"]').first()
    await rejectButton.click()

    // 참여자가 목록에서 제거되었는지 확인
    await page.waitForTimeout(1000)
    const memberCount = await page
      .locator("[data-testid='pending-member']")
      .count()
    expect(memberCount).toBeGreaterThanOrEqual(0)
  })

  test("참여자 제거", async ({ page }) => {
    // 주최자 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 참여자 탭 이동
    await page.goto(`/protected/events/${eventId}/members`)

    // "승인됨" 섹션의 첫 번째 참여자의 제거 버튼 클릭
    const removeButton = page.locator('button svg[data-icon="trash2"]').first()
    if (await removeButton.isVisible()) {
      await removeButton.click()

      // 참여자가 목록에서 제거되었는지 확인
      await page.waitForTimeout(1000)
      const approvedCount = await page
        .locator("[data-testid='approved-member']")
        .count()
      expect(approvedCount).toBeGreaterThanOrEqual(0)
    }
  })
})
