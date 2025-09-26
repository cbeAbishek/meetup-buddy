import { Chat } from "@/components/chat";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">AI Meeting Buddy Chat</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[600px] overflow-hidden">
            <CardContent className="p-0">
              <Chat className="h-[600px]" />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
              <p className="text-gray-700 mb-4">
                This is a demonstration of the AI Meeting Buddy chat interface. It showcases different message types and interactions.
              </p>
              
              <h3 className="text-lg font-medium mt-6 mb-2">Try These Commands:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Show my upcoming meetings</li>
                <li>What's on the agenda?</li>
                <li>Any follow-up tasks for me?</li>
                <li>Help me schedule a meeting</li>
                <li>What can you do?</li>
              </ul>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
                <p className="font-medium">Note:</p>
                <p className="mt-1">This is a demo with simulated responses. In a real implementation, the bot would connect to your calendar and task management systems.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}