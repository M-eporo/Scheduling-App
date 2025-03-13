import { useState } from "react";
import styles from "../styles/ProfileUpLoader.module.css";
import { auth } from "../firebase";

const ProfileUpLoader = () => {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState <string | null >(auth.currentUser?.photoURL || "");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }
  return (
    <div>
      <img width="800" height="450" src="" alt="プロフィール画像" />
      <input type="file" onChange={handleImageChange} />
    </div>
  )
}

export default ProfileUpLoader