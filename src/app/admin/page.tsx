import AdminPanel from '@/components/AdminPanel'

export default function AdminPage() {
  // TODO: Implement authentication check
  // const session = await getServerSession()
  // if (!session || !hasPermission(session.user.role, 'read')) {
  //   redirect('/login')
  // }
  
  // Mock user role - dalam implementasi nyata akan dari session/database
  const userRole = 'ADMIN' // atau ambil dari session: session.user.role
  
  return (
    <div>
      <AdminPanel userRole={userRole} />
    </div>
  )
}
