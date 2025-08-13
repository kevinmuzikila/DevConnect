import { JobDetails } from "../(components)/JobDetail"

export default function JobPage({ params }: { params: { id: string } }) 
{
  return <JobDetails jobId={params.id} />
}
