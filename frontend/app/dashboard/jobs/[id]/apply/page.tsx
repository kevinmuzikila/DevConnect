import { JobApplication } from "../../(components)/jobApplication"



export default function JobApplicationPage({ params }: { params: { id: string } }) {
  return <JobApplication jobId={params.id} />
}
