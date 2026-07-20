import { prisma } from "@/lib/db"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kullanıcılar</h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Ad</th>
              <th className="text-left p-3 font-medium">E-posta</th>
              <th className="text-left p-3 font-medium">Rol</th>
              <th className="text-left p-3 font-medium">Sipariş</th>
              <th className="text-left p-3 font-medium">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{user.name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${user.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                    {user.role === "ADMIN" ? "Admin" : "Kullanıcı"}
                  </span>
                </td>
                <td className="p-3">{user._count.orders}</td>
                <td className="p-3 text-muted-foreground">
                  {user.createdAt.toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
