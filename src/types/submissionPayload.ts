export type SubmissionPayload = {
    code: string,
    language: string,
    testCases:{ input: string; output: string }[]
    submissionId:string
    userId:string
}