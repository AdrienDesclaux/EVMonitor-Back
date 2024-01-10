const validateForm = {
  validatePassword: (password) => {
    // Setup the regex condition for the password
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    // Test the provided password
    const validPassword = regex.test(password);
    return validPassword;
  },

  validateEmail: (email) => {
    // Setup the regex condition for the email
    const regex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    // Test the provided email
    const validEmail = regex.test(email);
    return validEmail;
  },
};

module.exports = validateForm;
