export const highlightConsoleOutput = (text: string) => {
  // Try to detect and parse JSON objects/arrays
  try {
    const parsed = JSON.parse(text);
    return highlightValue(parsed);
  } catch {
    // Not JSON, try to detect primitives
    return highlightPrimitive(text);
  }
};

const highlightValue = (value: any, depth = 0): JSX.Element => {
  if (value === null) {
    return <span className="text-purple-400">null</span>;
  }
  
  if (value === undefined) {
    return <span className="text-muted-foreground">undefined</span>;
  }
  
  if (typeof value === "boolean") {
    return <span className="text-amber-400">{String(value)}</span>;
  }
  
  if (typeof value === "number") {
    return <span className="text-blue-400">{String(value)}</span>;
  }
  
  if (typeof value === "string") {
    return <span className="text-green-400">"{value}"</span>;
  }
  
  if (Array.isArray(value)) {
    return (
      <span>
        <span className="text-muted-foreground">[</span>
        {value.map((item, index) => (
          <span key={index}>
            {highlightValue(item, depth + 1)}
            {index < value.length - 1 && <span className="text-muted-foreground">, </span>}
          </span>
        ))}
        <span className="text-muted-foreground">]</span>
      </span>
    );
  }
  
  if (typeof value === "object") {
    const entries = Object.entries(value);
    return (
      <span>
        <span className="text-muted-foreground">{"{"}</span>
        {entries.map(([key, val], index) => (
          <span key={key}>
            <span className="text-cyan-400">{key}</span>
            <span className="text-muted-foreground">: </span>
            {highlightValue(val, depth + 1)}
            {index < entries.length - 1 && <span className="text-muted-foreground">, </span>}
          </span>
        ))}
        <span className="text-muted-foreground">{"}"}</span>
      </span>
    );
  }
  
  return <span>{String(value)}</span>;
};

const highlightPrimitive = (text: string): JSX.Element => {
  // Check for null
  if (text === "null") {
    return <span className="text-purple-400">null</span>;
  }
  
  // Check for undefined
  if (text === "undefined") {
    return <span className="text-muted-foreground">undefined</span>;
  }
  
  // Check for boolean
  if (text === "true" || text === "false") {
    return <span className="text-amber-400">{text}</span>;
  }
  
  // Check for number
  if (!isNaN(Number(text)) && text.trim() !== "") {
    return <span className="text-blue-400">{text}</span>;
  }
  
  // Check if it's a quoted string
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return <span className="text-green-400">{text}</span>;
  }
  
  // Default - treat as plain text
  return <span>{text}</span>;
};
