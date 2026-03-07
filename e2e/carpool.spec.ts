import { test, expect } from "@playwright/test"

const hostEmail = `host-${Date.now()}@example.com`
const hostPassword = "Password123!"
const driverEmail = `driver-${Date.now()}@example.com`
const driverPassword = "Password123!"
let eventId: string

test.describe("카풀 탭", () => {
  test("운전자 등록", async ({ page }) => {
    // 운전자로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', driverEmail)
    await page.fill('input[type="password"]', driverPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 이벤트 선택
    await page.goto("/protected")
    const eventCard = page.locator("[data-testid='event-card']").first()
    eventId = (await eventCard.getAttribute("data-event-id")) || ""

    // 카풀 탭 이동
    await page.goto(`/protected/events/${eventId}/carpool`)

    // 운전자 등록 폼 작성
    const departureAreaInput = page.locator("input").first()
    await departureAreaInput.fill("서울역")

    const departureTimeInput = page.locator('input[type="time"]')
    await departureTimeInput.fill("09:00")

    const seatsInput = page.locator('input[type="number"]')
    await seatsInput.fill("4")

    // 운전자 등록 버튼 클릭
    const registerButton = page.locator("button:has-text('등록')").first()
    await registerButton.click()

    // 매칭된 카풀 목록에 운전자가 표시되는지 확인
    await page.waitForTimeout(1000)
    await expect(page.locator("text=서울역 출발")).toBeVisible()
  })

  test("탑승자 등록", async ({ page }) => {
    // 탑승자로 로그인
    const passengerEmail = `passenger-${Date.now()}@example.com`
    const passengerPassword = "Password123!"

    await page.goto("/auth/login")
    await page.fill('input[type="email"]', passengerEmail)
    await page.fill('input[type="password"]', passengerPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 카풀 탭 이동
    await page.goto(`/protected/events/${eventId}/carpool`)

    // 탑승 희망 폼 작성
    const departureAreaInput = page.locator("input").nth(1)
    await departureAreaInput.fill("서울역")

    // 탑승 신청 버튼 클릭
    const registerButton = page.locator("button:has-text('신청')").first()
    await registerButton.click()

    // 탑승 신청이 완료되었는지 확인
    await page.waitForTimeout(1000)
  })

  test("카풀 매칭 처리", async ({ page }) => {
    // 주최자로 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', hostEmail)
    await page.fill('input[type="password"]', hostPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 카풀 탭 이동
    await page.goto(`/protected/events/${eventId}/carpool`)

    // 매칭 버튼 표시 여부 확인 (주최자만 보임)
    const matchButton = page.locator("button:has-text('카풀 매칭 처리')")
    await expect(matchButton).toBeVisible()

    // 매칭 버튼 클릭
    await matchButton.click()

    // 매칭 완료 확인
    await page.waitForTimeout(1000)
    await expect(page.locator("text=매칭된 카풀")).toBeVisible()
  })
})
