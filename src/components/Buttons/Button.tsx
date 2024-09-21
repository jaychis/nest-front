const colors = {
  cancel: '#CCC',
  next: '#0079D3',
} as const;

type Props = {
  onClick: () => void;
  type: 'submit' | 'button';
  children: React.ReactNode;
  bgColor: keyof typeof colors;
};

export default function Button({ onClick, bgColor, children }: Props) {
  return (
    <button
      style={{
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '12px 20px',
        borderRadius: '20px',
        backgroundColor: colors[bgColor],
        fontWeight: 'bold' as 'bold',
        transition: 'background-color 0.3s ease',
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
