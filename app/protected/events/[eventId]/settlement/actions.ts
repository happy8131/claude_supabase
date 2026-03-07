"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { settlementItemSchema } from "@/lib/schemas/settlement"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

// 정산 항목 추가
export async function addSettlementItem(
  settlementId: string,
  name: string,
  amount: number,
  paidBy: string,
): Promise<ActionResult<{ itemId: string }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // Zod 검증
    const validated = settlementItemSchema.safeParse({
      name,
      amount,
    })

    if (!validated.success) {
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // 정산 항목 삽입
    const { data, error } = await supabase
      .from("settlement_items")
      .insert([
        {
          settlement_id: settlementId,
          name: validated.data.name,
          amount: validated.data.amount,
          paid_by: paidBy,
        },
      ])
      .select()

    if (error || !data?.[0]) {
      return {
        success: false,
        message: `정산 항목 추가 실패: ${error?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath(`/protected/events`)

    return {
      success: true,
      message: "정산 항목이 추가되었습니다",
      data: { itemId: data[0].id },
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 정산 항목 삭제
export async function deleteSettlementItem(
  itemId: string,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 정산 항목 조회
    const { data: item, error: itemError } = await supabase
      .from("settlement_items")
      .select("settlement_id")
      .eq("id", itemId)
      .single()

    if (itemError || !item) {
      return { success: false, message: "정산 항목을 찾을 수 없습니다" }
    }

    // 정산 항목 삭제
    const { error } = await supabase
      .from("settlement_items")
      .delete()
      .eq("id", itemId)

    if (error) {
      return {
        success: false,
        message: `정산 항목 삭제 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events`)

    return {
      success: true,
      message: "정산 항목이 삭제되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 결제 완료 처리
export async function markAsPaid(paymentId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 결제 항목 조회
    const { data: payment, error: paymentError } = await supabase
      .from("settlement_payments")
      .select("*")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      return { success: false, message: "결제 항목을 찾을 수 없습니다" }
    }

    // 본인이거나 받는 사람인지 확인
    if (user.id !== payment.user_id) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 결제 상태 업데이트
    const { error } = await supabase
      .from("settlement_payments")
      .update({ status: "paid" })
      .eq("id", paymentId)

    if (error) {
      return {
        success: false,
        message: `결제 처리 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events`)

    return {
      success: true,
      message: "결제가 완료되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
