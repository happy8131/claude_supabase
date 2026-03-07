import { test, expect } from "@playwright/test"

const testEmail = `test-${Date.now()}@example.com`
const testPassword = "Password123!"
let eventId: string

test.beforeAll(async () => {
  // 테스트용 이벤트 생성 (필요시 API 호출)
  // 이 부분은 실제 구현에서는 테스트용 fixture로 처리될 수 있습니다.
})

test.describe("공지사항 탭", () => {
  test("공지사항 생성 → 수정 → 삭제", async ({ page }) => {
    // 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 이벤트 목록에서 첫 번째 이벤트 클릭
    await page.goto("/protected")
    const eventCard = page.locator("[data-testid='event-card']").first()
    eventId = (await eventCard.getAttribute("data-event-id")) || ""

    // 공지사항 탭 이동
    await page.goto(`/protected/events/${eventId}/announcements`)

    // 공지 생성
    const titleInput = page.locator("input:has-text('제목')")
    await titleInput.fill("테스트 공지")

    const contentTextarea = page.locator("textarea:has-text('내용')")
    await contentTextarea.fill("테스트 공지 내용")

    const submitButton = page.locator("button:has-text('게시')")
    await submitButton.click()

    // 공지가 목록에 표시되는지 확인
    await expect(page.locator("text=테스트 공지")).toBeVisible()

    // 공지 수정
    const editButton = page.locator("button svg[data-icon='edit2']").first()
    await editButton.click()

    const editTitleInput = page.locator("input").first()
    await editTitleInput.fill("수정된 공지")

    const saveButton = page.locator("button svg[data-icon='save']").first()
    await saveButton.click()

    // 수정된 내용 확인
    await expect(page.locator("text=수정된 공지")).toBeVisible()

    // 공지 삭제
    const deleteButton = page.locator("button svg[data-icon='trash2']").first()
    await deleteButton.click()

    // 삭제 확인 (목록에서 제거됨)
    await expect(page.locator("text=수정된 공지")).not.toBeVisible()
  })

  test("공지 고정 기능", async ({ page }) => {
    // 로그인
    await page.goto("/auth/login")
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click("button:has-text('로그인')")
    await page.waitForNavigation()

    // 공지사항 탭 이동
    await page.goto(`/protected/events/${eventId}/announcements`)

    // 공지 생성
    const titleInput = page.locator("input:has-text('제목')")
    await titleInput.fill("고정할 공지")

    const contentTextarea = page.locator("textarea:has-text('내용')")
    await contentTextarea.fill("고정할 공지 내용")

    const pinCheckbox = page.locator('input[type="checkbox"]')
    await pinCheckbox.check()

    const submitButton = page.locator("button:has-text('게시')")
    await submitButton.click()

    // 고정 배지 확인
    await expect(page.locator("text=고정")).toBeVisible()
  })
})
