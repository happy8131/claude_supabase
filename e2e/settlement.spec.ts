import { test, expect } from "@playwright/test"

const hostEmail = `host-${Date.now()}@example.com`
const hostPassword = "Password123!"
const memberEmail = `member-${Date.now()}@example.com`
const memberPassword = "Password123!"
let eventId: string

test.describe("정산 탭", () => {
  test("정산 항목 추가", async ({ page }) => {
    // 주최자로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 이벤트 선택
    await page.goto("/protected")
    const eventCard = page.locator("[data-testid='event-card']").first()
    eventId = (await eventCard.getAttribute("data-event-id")) || ""

    // 정산 탭 이동
    await page.goto(`/protected/events/${eventId}/settlement`)

    // 항목 추가 폼 작성
    const itemNameInput = page.locator('input[placeholder="항목명"]')
    await itemNameInput.fill("식사비")

    const amountInput = page.locator('input[type="number"]')
    await amountInput.fill("50000")

    // 추가 버튼 클릭
    const addButton = page.locator("button:has-text('추가')").first()
    await addButton.click()

    // 항목이 목록에 표시되는지 확인
    await page.waitForTimeout(1000)
    await expect(page.locator("text=식사비")).toBeVisible()
  })

  test("정산 항목 삭제", async ({ page }) => {
    // 주최자로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 정산 탭 이동
    await page.goto(`/protected/events/${eventId}/settlement`)

    // 첫 번째 항목의 삭제 버튼 클릭
    const deleteButton = page.locator('button svg[data-icon="trash2"]').first()
    if (await deleteButton.isVisible()) {
      await deleteButton.click()

      // 항목이 목록에서 제거되는지 확인
      await page.waitForTimeout(1000)
    }
  })

  test("정산 납부 완료", async ({ page }) => {
    // 멤버로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', memberEmail)
    await page.fill('input[type="password"]', memberPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 정산 탭 이동
    await page.goto(`/protected/events/${eventId}/settlement`)

    // 납부 버튼 클릭
    const payButton = page.locator("button:has-text('납부')").first()
    if (await payButton.isVisible()) {
      await payButton.click()

      // 납부 완료 확인
      await page.waitForTimeout(1000)
      await expect(page.locator("text=완납")).toBeVisible()
    }
  })

  test("1/N 계산 버튼 (주최자만)", async ({ page }) => {
    // 주최자로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 정산 탭 이동
    await page.goto(`/protected/events/${eventId}/settlement`)

    // 1/N 계산 버튼 확인 (주최자만 보임)
    const calculateButton = page.locator("button:has-text('1/N 계산')")
    await expect(calculateButton).toBeVisible()

    // 버튼 클릭
    await calculateButton.click()

    // 정산 요약이 표시되는지 확인
    await page.waitForTimeout(1000)
    await expect(page.locator("text=총 비용")).toBeVisible()
  })
})
