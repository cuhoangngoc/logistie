// register validation rules

const registerValidation = (data) => {
  const output = { error: false, message: '' };

  for (const [key, value] of Object.entries(data))
    if (!value) {
      output.error = true;
      output.message = `Vui lòng nhập ${key}`;
    }

  // Email must be valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    output.error = true;
    output.message = 'Email không hợp lệ';
  }

  if (data.username.length < 3) {
    output.error = true;
    output.message = 'Tên đăng nhập phải có ít nhất 3 ký tự';
  }

  // password must be at least 8 characters, contain lowercase, uppercase, number, and special character
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(data.password)) {
    output.error = true;
    output.message =
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt';
  }

  if (data.cccd.length !== 12) {
    output.error = true;
    output.message = 'Số CCCD phải có 12 ký tự';
  }

  if (data.password !== data.passwordConfirmation) {
    output.error = true;
    output.message = 'Mật khẩu không khớp';
  }

  return output;
};

export default registerValidation;
