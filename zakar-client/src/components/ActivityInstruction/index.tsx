import React, { ReactElement, useState, useEffect, useRef } from 'react';
import './ActivityInstruction.css';

interface Props {
  instruction: string;
}

const ActivityInstruction = (props: Props): ReactElement => {
  const toolTipRef = useRef<HTMLDivElement>(null);
  const { instruction } = props;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: Event) => {
        if (toolTipRef.current && !toolTipRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div>
      <button className="ToolTip" onClick={() => setIsOpen(!isOpen)}>
        ?
      </button>
      {isOpen && (
        <div ref={toolTipRef} className="ActivityInstruction" dangerouslySetInnerHTML={{ __html: instruction }} />
      )}
    </div>
  );
};

export default ActivityInstruction;
