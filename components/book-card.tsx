import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BookCardProps {
  title: string
  dateBorrowed: string
  dueDate: string
  returnDate?: string
  status?: string
  isHistory?: boolean
}

export function BookCard({ title, dateBorrowed, dueDate, returnDate, status, isHistory }: BookCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">Date Borrowed: {dateBorrowed}</p>
          <p className="text-sm text-gray-500">Due Date: {dueDate}</p>
          {returnDate && <p className="text-sm text-gray-500">Return Date: {returnDate}</p>}
          {status && <p className="text-sm text-gray-500">Status: {status}</p>}
        </div>
        <div className="space-y-2">
          {!isHistory && <Button variant="outline">Renew</Button>}
          <Button variant="outline">See Book Details</Button>
        </div>
      </CardContent>
    </Card>
  )
}

