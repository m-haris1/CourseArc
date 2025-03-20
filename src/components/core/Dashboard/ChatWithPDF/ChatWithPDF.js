function ChatWithPdfPage() {
    return (
        <div className="">
            <h2>Chat with PDF</h2>
            <iframe 
                width="100%"
                height="590px"
                src="http://localhost:8501" 
                style={{ border: "none" }}
            ></iframe>
        </div>
    );
}

export default ChatWithPdfPage;
