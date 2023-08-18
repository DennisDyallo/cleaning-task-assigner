import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { assignTasks, formatAssignmentsToHTML} from './cleaning-assigner'; 

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const responseMessage = formatAssignmentsToHTML(assignTasks())
    context.res = {
        body: responseMessage,
        headers: {'content-type':'text/html'}
    };
};

export default httpTrigger;