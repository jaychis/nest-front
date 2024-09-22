type Props = {
  onClick: () => void;
};

export default function DeleteButton({ onClick }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      &times;
    </button>
  );
}
