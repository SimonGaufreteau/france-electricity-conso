<template>
  <div class="login-module">
    <!-- User not logged = login form -->
    <div v-if="!isLogged">
      <div v-if="!registerActive">
        <h1>Sign In</h1>
        <form v-on:submit.prevent="doLogin" class="form-group">
          <input
            v-model="userLogin"
            type="username"
            class="form-control"
            placeholder="Username"
            required
          />
          <input
            v-model="passwordLogin"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
          <input type="submit" class="btn btn-primary" />
          <div v-if="errorFormText != ''" class="error-form">
            Erreur :{{ errorFormText }}
          </div>
          <!-- @click="doLogin" -->
          <p>
            Don't have an account?
            <a
              href="#"
              @click="(registerActive = !registerActive), (emptyFields = false)"
              >Sign up here</a
            >
          </p>
        </form>
      </div>
      <div v-else>
        <h1>Sign Up</h1>
        <form v-on:submit.prevent="doRegister" class="form-group">
          <input
            v-model="userReg"
            type="username"
            class="form-control"
            placeholder="Username"
            required
          />
          <input
            v-model="passwordReg"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
          <input
            v-model="confirmReg"
            type="password"
            class="form-control"
            placeholder="Confirm Password"
            required
          />
          <input
            v-model="nomReg"
            type="text"
            class="form-control"
            placeholder="Nom"
            required
          />
          <input
            v-model="prenomReg"
            type="text"
            class="form-control"
            placeholder="Prénom"
            required
          />
          <input
            v-model="regionReg"
            type="number"
            class="form-control"
            placeholder="Région"
            required
          />
          <input type="submit" class="btn btn-primary" />
          <div v-if="errorFormText != ''" class="error-form">
            Erreur :{{ errorFormText }}
          </div>
          <p>
            Already have an account?
            <a href="#" @click="registerActive = !registerActive"
              >Sign in here</a
            >
          </p>
        </form>
      </div>
    </div>
    <!-- User logged = logout form -->
    <div v-else>
      <a href="#" @click="doLogout">Logout</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginForm",
  data: function () {
    return {
      registerActive: false,
      userLogin: "",
      passwordLogin: "",
      userReg: "",
      nomReg: "",
      prenomReg: "",
      passwordReg: "",
      regionReg: 0,
      errorFormText: "",
    };
  },
  computed: {
    isLogged() {
      return this.$store.state.isLogged;
    },
  },
  methods: {
    async doLogout() {
      console.log("Logout");
      this.$store.dispatch("logout");
    },
    async doLogin() {
      console.log("Sending login");
      this.$store
        .dispatch("login", {
          login: this.userLogin,
          password: this.passwordLogin,
        })
        .catch(
          () =>
            (this.errorFormText =
              "Nous n'avons pas pu vous connecter avec ces identifiants. Merci de réessayer")
        );
    },
    async doRegister() {
      const dataReg = {
        login: this.userReg,
        nom: this.nomReg,
        prenom: this.prenomReg,
        password: this.passwordReg,
        region: this.regionReg,
      };
      this.userLogin = this.userReg;
      this.passwordLogin = this.passwordReg;
      this.$store
        .dispatch("register", dataReg)
        .then(() => {
          console.log("Registered, login in with the same credetials...");
          return this.doLogin();
        })
        .catch(() => {
          this.errorFormText =
            "Problème lors de l'enregistrement. Vérifiez le nom d'utiliseur et le code région.";
        });
    },
  },
  created() {},
};
</script>

<style>
</style>