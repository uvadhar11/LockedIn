/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  // tells tailwind where our index.html file and src files are (in case we move it outside the default file placement)
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // overriding default files
    // fontFamily: {
    //   // sans is default font injected by tailwind and then by overriding this value, we are setting every font to roboto mono
    //   sans: "Roboto Mono, monospace",
    // },
    // extends the basic styles (can see them in documentation and github link for the default files and object stuff). can add stuff by putting it into extend, but if you put something that has an already existing name then it will override it.
    extend: {
      // so now pizza is a color you can use
      // colors: {
      //   pizza: "#123456",
      // },
      // ensures viewport height is 100% because sometimes its not
      // screen: {
      //   height: "100dvh",
      // },
    },
    plugins: [],
  },
=======
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
>>>>>>> 70c08b1d47c9d630b6196b22952794edd2a56e98
};
