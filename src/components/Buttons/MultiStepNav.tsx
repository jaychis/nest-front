type Props = {
  children: React.ReactNode;
};

export default function MultiStepNav({ children }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </div>
  );
}
