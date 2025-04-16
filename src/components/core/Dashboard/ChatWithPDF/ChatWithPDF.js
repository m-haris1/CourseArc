function ChatWithPdfPage() {
    return (
      <div className="min-h-screen bg-richblue-900 font-inter px-4 py-12">
        <div className="max-w-maxContent mx-auto bg-richblue-800 rounded-xl shadow-lg p-8 border border-richblue-600">
          {/* Welcome Heading */}
          <h1 className="text-3xl font-semibold text-blue-5 mb-4">
            👋 Welcome to Chat with PDF
          </h1>
  
          {/* Description */}
          <p className="text-base text-richblue-25 leading-relaxed mb-4">
            This tool allows you to upload and chat with your PDF documents in real-time.
            It’s perfect for summarizing long documents, asking questions, or quickly
            retrieving specific information.
          </p>
  
          {/* Instructions */}
          <ol className="list-decimal list-inside text-richblue-25 text-base space-y-2 mb-6">
            <li>Upload your PDF file in the embedded app below.</li>
            <li>Ask any question related to your document in the chat box.</li>
            <li>Get instant answers powered by AI.</li>
          </ol>
  
          {/* External Link as Fallback */}
          <p className="mb-6 text-richblue-25">
            If the app doesn't load, you can open it in a new tab:&nbsp;
            <a
              href="https://chat-with-pdf-51cz.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-200 text-richblue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-100 transition-all duration-200"
            >
              Open Chat with PDF
            </a>
          </p>
  
          {/* Embedded iFrame */}
          <div className="rounded-lg overflow-hidden border border-richblue-600">
            <iframe
              title="Chat with PDF"
              src="https://chat-with-pdf-51cz.onrender.com/"
              className="w-full h-[590px] border-none"
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
  
  export default ChatWithPdfPage;
  