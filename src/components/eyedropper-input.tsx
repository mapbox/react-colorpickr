import React, { useRef, useEffect } from 'react';
import themeable from 'react-themeable';
import { autokey } from '../autokey.ts';

interface Props {
  theme: { [id: string]: string };
  onChange: (n: number) => void;
  disabled: boolean;
}

function EyedropperInput({ onChange, theme, disabled = false }: Props) {
  const action = useRef<HTMLButtonElement>();
  const dropper = useRef(new EyeDropper());
  const abortController = useRef(new AbortController());
  const themer = autokey(themeable(theme));

  useEffect(() => {
    return () => abortController.current.abort();
  }, []);

  const activateDropper = async () => {
    if (action.current) {
      action.current.classList.add('is-active');
    }

    try {
      const result = await dropper.current.open({
        signal: abortController.current.signal
      });
      onChange(result.sRGBHex);
      if (action.current) {
        action.current.classList.remove('is-active');
      }
    } catch (e) {
      return null;
    }
  };

  return (
    <button
      {...themer('eyeDropper')}
      ref={action}
      type="button"
      disabled={disabled}
      onClick={activateDropper}
    >
      <svg xmlns="http://www.w3.org/2000/svg" {...themer('eyeDropperIcon')}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.793 15.5a.5.5 0 0 0 .353-.146L11.75 9.75 12 10a.707.707 0 1 0 1-1l-.25-.25 2.836-2.836a2 2 0 0 0 0-2.828l-.672-.672a2 2 0 0 0-2.828 0L9.25 5.25 9 5a.707.707 0 0 0-1 1l.25.25-5.604 5.604a.5.5 0 0 0-.146.353V15a.5.5 0 0 0 .5.5h2.793Zm-.293-1L11 9 9 7l-5.5 5.5v2h2Z"
        />
      </svg>
    </button>
  );
}

export { EyedropperInput };
