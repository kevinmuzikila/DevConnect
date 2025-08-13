import { AdminView } from "../../(components)/AdminView"


export default function JobDetails({ params }: { params: { id: string } }) {
  return <AdminView jobId={params.id} />
}
