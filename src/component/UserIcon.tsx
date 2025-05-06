type Props = {
  userName: string;
}

const UserIcon = ({ userName }: Props) => {
  return (
    <div>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="circleTextPath" d="M75,75 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
        </defs>
        <circle cx="50" cy="50" r="40" fill="#f2f2f2" stroke="#000" />
        <text x="50" y="55" textAnchor="middle" fontSize="12" fill="black" fontWeight="bold">
          {userName}
        </text>
      </svg>
    </div>
  )
}

export default UserIcon