<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
import Modal from '../components/Modal.vue'
</script>

<script>
import {db, ref, set, push, onChildChanged, onValue, remove, auth} from '../assets/js/firebase.js';
import * as THREE from 'three';

import { BufferGeometryUtils } from 'https://unpkg.com/three@0.126.0/examples/jsm/utils/BufferGeometryUtils.js';
import { gsap } from 'gsap';

import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
// Création de la scène et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer( { alpha: true });
// renderer.setSize( 250, 250 );
// const surfaceCanvas = document.querySelector('#surface');
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM entièrement chargé et analysé");
// document.querySelector('.testThree').appendChild( renderer.domElement );


  let surface = new Surface();

  new THREE.TextureLoader().load(
      'https://assets.codepen.io/959327/matcap-crystal.png',
      (matcapTexture) => {
        surface.createObjects(matcapTexture);
        surface.startLoop(surface);
      });


});

class Surface {

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 25);
    this.renderer = new THREE.WebGLRenderer({alpha : true, canvas: document.querySelector('#surface')});
    this.renderer.setSize(600, 300)
    this.createOrbitControls();
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, document.querySelector('#surface'));
    this.controls.enablePan = true;
    this.controls.enabled = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = .35 * Math.PI;
    this.controls.maxPolarAngle = .65 * Math.PI;
    this.controls.autoRotate = true;
  }

  createObjects(matcapTexture) {

    this.dummy = new THREE.Object3D();

    const ballInnerMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const mirrorMaterial = new THREE.MeshMatcapMaterial({ side: THREE.BackSide });
    mirrorMaterial.matcap = matcapTexture;

    const numberOfBalls = 1;
    this.balls = [];

    for (let i = 0; i < numberOfBalls; i++) {
      this.balls[i] = this.createBall(7 + Math.random(), ballInnerMaterial, mirrorMaterial);
      this.balls[i].position.set(
          0,
          0,
          0,
      );
      this.scene.add(this.balls[i]);
    }
  }

  createBall(radius, innerSphereMaterial, planeMaterial) {
    const ballInnerGeometry = new THREE.SphereBufferGeometry(radius, 9, 9);

    let isoGeometry = new THREE.IcosahedronBufferGeometry(radius, 3);
    isoGeometry.deleteAttribute('normal');
    isoGeometry.deleteAttribute('uv');
    isoGeometry = BufferGeometryUtils.mergeVertices(isoGeometry);
    const mirrorGeometry = new THREE.PlaneBufferGeometry(.23 * radius, .23 * radius, 1, 1);

    let isoVertices = isoGeometry.attributes.position.array;
    let instancedMirrorMesh = new THREE.InstancedMesh(
        mirrorGeometry,
        planeMaterial,
        isoGeometry.attributes.position.count
    );
    for (let i = 0; i < isoVertices.length; i += 3) {
      this.dummy.position.set(isoVertices[i], isoVertices[i + 1], isoVertices[i + 2]);
      this.dummy.lookAt(0, 0, 0);
      this.dummy.updateMatrix();
      instancedMirrorMesh.setMatrixAt(i / 3, this.dummy.matrix);
    }

    const group = new THREE.Group();
    group.add(new THREE.Mesh(
        ballInnerGeometry,
        innerSphereMaterial
    ));
    group.add(instancedMirrorMesh);
    return group;
  }

  startLoop(surface) {
    surface.balls.forEach((b, bIdx) => {
      gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          if (bIdx === 0) {
            surface.controls.update();
            surface.renderer.render(surface.scene, surface.camera);
          }
        }
      })
          .to(b.rotation, {
            duration: 4 + Math.random() * 4,
            y: Math.random() > .5 ? -2 * Math.PI: 2 * Math.PI,
            // y: Math.random() > .5 ? -2 * Math.PI: 2 * Math.PI,
            ease: 'none'
          })
    })
  }
}

export default {
  data() {
    return {
      clicker: '',
      users: {},
      imgLink : 'https://picsum.photos/400',
      playerName : 'Blind test by Graig',
      showMenuAddPlayer : false,
      isMusicPlaying :false,
      version : import.meta.env.VITE_VERSION,
      spotifyToken : '',
      blur : "filter : blur(0px);",
      nextTrack : 0,
      messageBoutonGoogle : ''
    }
  },
  methods: {
    setDataFirebase(node, data){
      // On push vers firebase le nouvel utilisateur
      set(ref(db, node), data);
    },
    // Ajout d'un utilisateur dans la bdd
    addUser() {
      // Récupération des infos de l'utilisateur
      let username = document.querySelector('#username').value;
      // let buzzerId = document.querySelector('#buzzer').value;

      // Génération d'un id pour le state pour l'api Dicebear
      let id = new Date();
      id = id.getTime();

      // Récupération d'un avatar random
      let profilePicture = 'https://avatars.dicebear.com/api/avataaars/' + id + '.svg'

      // On push vers firebase le nouvel utilisateur
      push(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS), {
        "buzzerId": 0,
        "username": username,
        "profilePicture" : profilePicture,
        "points" : 0
      }).key;

      // On cache le menu d'ajout d'un nouvel utilisateur
      this.showMenuAddPlayer = false;
    },
    getUsers() {
      // Récupération des users en BDD à la création du component
      let userDb = ref(db, import.meta.env.VITE_FIREBASE_DB_USERS);
      onValue(userDb, (data) => {
        this.users = data.val();
      });
    },
    // Suppression d'un utilisateur dans la BDD
    removeUser(idFb){
      remove(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS+'/'+idFb));
    },
    showMenuAddPlayerFunction() {
      this.showMenuAddPlayer = !this.showMenuAddPlayer;
    },
    setMusicStatusPlayer(dataSpotifyPlayer){
      this.isMusicPlaying = dataSpotifyPlayer.isMusicPlaying;
      this.spotifyToken = dataSpotifyPlayer.spotifyToken;
    },
    resetBlurAndWinner(nextTrack){
      this.blur = "filter : blur(0px);";

      // Si la personne a trouvé artiste + titre, on passe à la musique suivante
      if (nextTrack){
        this.isMusicPlaying = true;
        let today= new Date();
        this.nextTrack = today.getTime()
      }
      // Sinon on reset juste le dernier clicker
      else {
        this.clicker = '';
        this.setDataFirebase(import.meta.env.VITE_FIREBASE_DB_CLICKER, {'nom' : ''})
      }
    }
  },
  created(){
    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
    onChildChanged(clickerDb, (data) => {
      if (this.isMusicPlaying) {
        this.clicker = data.val();
        this.blur = "filter : blur(60px);";
      }
    });

    let vm = this;
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        vm.messageBoutonGoogle = 'Connecté en tant que ' + user.displayName + ' (Cliquer pour se déconnecter)';
        // Récupération des users en BDD à la connexion Google
        vm.getUsers();
      } else {
        // No user is signed in.
        vm.messageBoutonGoogle = 'Se connecter avec Google';
        vm.users = {};
      }
    });
    // Fonctionnel - Commenté pour l'instant car coùte des calls API (50 gratuits par heure)
    // Choisit une image sur le thème de la musique au hasard dans la base de données unsplash
    // Et la met en fond d'écran de l'app
    // let url = 'https://api.unsplash.com/photos/random?client_id=' + import.meta.env.VITE_UNSPLASH_CLIENT_ID + '&query=music&orientation=landscape'
    // fetch(url)
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(data => {
    //         document.querySelector('#app').style.backgroundImage = "url(" + data.urls.full + ")";
    //     })
    document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1466428996289-fb355538da1b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2OTU&ixlib=rb-1.2.1&q=80')";
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";
  }
}
</script>

<template>
  <canvas id="surface" style="position: absolute;  top : 400px"></canvas>

  <main class="flex space-around" :style="blur">
    <PlayersList :spotifyToken="spotifyToken" :users="users" @show-menu-add-player="showMenuAddPlayerFunction" @remove-user="removeUser"/>
    <SpotifyPlayer @set-music-player-status="setMusicStatusPlayer" :isMusicPlaying="isMusicPlaying" :clicker="clicker" :setNextTrack="nextTrack" :message-bouton-google="messageBoutonGoogle"/>
  </main>
  <AddPlayer :showMenuAddPlayer="showMenuAddPlayer" @add-user="addUser"/>
  <Modal :isMusicPlaying="isMusicPlaying" :clicker="clicker" @reset-blur-and-winner="resetBlurAndWinner"/>
</template>

