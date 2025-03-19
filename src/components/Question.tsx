
const Question = ({ question }: { question: string }) => {
    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-4">Question</h1>
            <p className="text-lg mb-6">{question}</p>
            <h2 className="text-xl font-semibold mb-2">Sample Input</h2>
            <pre className="bg-gray-100 p-4 border border-gray-300 rounded mb-6">No inputs required</pre>
            <h2 className="text-xl font-semibold mb-2">Sample Output</h2>
            <pre className="bg-gray-100 p-4 border border-gray-300 rounded">Hello world</pre>
        </div>
    );
};

export default Question;