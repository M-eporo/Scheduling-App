type Props = {
  userName: string;
}

const UserIcon = ({ userName }: Props) => {
  return (
    <div>
      <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="circleTextPath" d="M75,75 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
        </defs>
        <circle cx="75" cy="75" r="40" fill="#f2f2f2" stroke="#000" />
        <text x="75" y="80" textAnchor="middle" fontSize="12" fill="black" fontWeight="bold">
          {userName}
        </text>
      </svg>
    </div>
  )
}

export default UserIcon