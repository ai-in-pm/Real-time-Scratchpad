import React, { useState, useEffect, useRef } from 'react';

interface OutputPaneProps {
  text: string;
  typingConfig?: {
    baseSpeed?: number;
    speedVariance?: number;
    mistakeChance?: number;
    mistakeFixDelay?: number;
  };
}

const OutputPane: React.FC<OutputPaneProps> = ({ 
  text, 
  typingConfig = {}
}) => {
  // State to hold the text that has been "typed" so far
  const [displayedText, setDisplayedText] = useState("");
  // Ref to keep track of active timeouts for cleanup
  const timeoutsRef = useRef<number[]>([]);

  // Configuration for typing speed and behavior with defaults
  const baseSpeed = typingConfig.baseSpeed ?? 50;        // base typing speed in ms per character
  const speedVariance = typingConfig.speedVariance ?? 100; // random additional delay (0 to 100 ms)
  const mistakeChance = typingConfig.mistakeChance ?? 0.1; // 10% chance to make a typo on any character
  const mistakeFixDelay = typingConfig.mistakeFixDelay ?? 300; // delay before fixing a typo, in ms

  // Clean up any pending timeouts if text changes or component unmounts
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [text]);

  useEffect(() => {
    // Reset displayed text when input text changes
    setDisplayedText("");
    
    let i = 0;  // index of next character to type from `text`

    const typeNextChar = () => {
      if (i >= text.length) {
        return; // All characters have been typed out
      }
      const currentChar = text[i];

      // Calculate a random delay for this keystroke
      const randomDelay = baseSpeed + Math.random() * speedVariance;

      if (currentChar === "\n") {
        // Handle new line: append the newline and pause slightly longer (double delay)
        setDisplayedText(prev => prev + "\n");
        i++;
        const timeout = window.setTimeout(typeNextChar, randomDelay * 2);
        timeoutsRef.current.push(timeout);
      } else if (Math.random() < mistakeChance) {
        // Simulate a typing mistake: type wrong char, then backspace, then type correct char
        // Generate a random typo character near the intended key on keyboard
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let wrongChar = currentChar;
        // Ensure wrong character is different from the correct one
        while (wrongChar === currentChar) {
          wrongChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        
        // Type the wrong character
        setDisplayedText(prev => prev + wrongChar);
        
        // Schedule removal of the wrong character (backspace)
        const backspaceTimeout = window.setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));  // remove last char
          
          // After a brief delay, type the correct character
          const fixTimeout = window.setTimeout(() => {
            setDisplayedText(prev => prev + currentChar);
            i++;
            
            // Continue with next character after the usual delay
            const nextCharTimeout = window.setTimeout(typeNextChar, randomDelay);
            timeoutsRef.current.push(nextCharTimeout);
          }, mistakeFixDelay);
          
          timeoutsRef.current.push(fixTimeout);
        }, randomDelay);
        
        timeoutsRef.current.push(backspaceTimeout);
      } else {
        // Normal typing: add the correct character
        setDisplayedText(prev => prev + currentChar);
        i++;
        
        // Schedule the next character after a delay
        const timeout = window.setTimeout(typeNextChar, randomDelay);
        timeoutsRef.current.push(timeout);
      }
    };

    // Start the typing simulation
    typeNextChar();

    // Cleanup function to clear timeouts if component unmounts mid-typing
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [text, baseSpeed, speedVariance, mistakeChance, mistakeFixDelay]);

  return (
    <div className="output-pane">
      {/* Preformatted text area to preserve whitespace and line breaks */}
      <pre>{displayedText}<span className="cursor">|</span></pre>
    </div>
  );
};

export default OutputPane;
