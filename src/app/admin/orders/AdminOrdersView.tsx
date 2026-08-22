"use client";

import { AdminGate, AdminNav } from "../AdminBits";
import { useApp } from "@/components/providers/AppProvider";
import { Section } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/types";

const states: OrderStatus[] = ["pending", "paid", "in-progress", "customization-required", "delivered", "completed", "cancelled", "refunded"];

export function AdminOrdersView() {
  const { orders, setOrderStatus } = useApp();
  return (
    <Section>
      <AdminGate>
        <AdminNav />
        <h1 className="display text-3xl">Orders</h1>
        <div className="mt-6 space-y-3">
          {!orders.length ? <p className="text-muted">No orders yet.</p> : null}
          {orders.map((order) => (
            <article key={order.id} className="glass rounded-3xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.projectTitle}</p>
                  <p className="text-xs text-muted">{order.id} · {formatPrice(order.price)}</p>
                </div>
                <select value={order.status} onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)} className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-sm">
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </AdminGate>
    </Section>
  );
}
