import {createStore} from 'vuex'
import {db, ref, set} from "@/assets/js/firebase";
/* Création du store */

function setDataFirebase(node, data)
{
    set(ref(db, node), data).then(r => console.log(r));
}

const fetchPlus = (url, requestOptions = {}, retries, context) =>
    fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                context.commit('setTitle', false);
                context.commit('setArtist', false)
                context.commit('setCount', 40)
                context.commit('setCountMax', 40)
                return res
            }
            if (retries > 0) {
                return fetchPlus(url, requestOptions, retries - 1, context)
            }
            throw new Error(res.status)
        })
        .catch(error => console.error(error.message))

const store = createStore({
    state()
    {
        return {
            isMusicPlaying: false,
            spotifyToken: '',
            spotifyDeviceId : '',
            spotifyMessage : 'Se connecter à Spotify',
            showMenuAddPlayer: false,
            clicker: '',
            showModal: false,
            blur: 0,
            title: false,
            artist: false,
            responseTest : '',
            count : 40,
            countMax : 40,
            users : {},
            requestSpotifyAuth : 0
        }
    }
    ,
    mutations:{
        setSpotifyToken(state, token){
            state.spotifyToken = token;
        },
        setUsers(state, users) {
            state.users = users;
        },
        setSpotifyDeviceId(state, deviceId) {
            state.spotifyDeviceId = deviceId;
        },
        setIsMusicPlaying(state, isMusicPlaying){
            state.isMusicPlaying = isMusicPlaying;
        }        ,
        setClicker(state, clicker){
            state.clicker = clicker;
        },
        showModal(state, isShowModal) {
            state.showModal = isShowModal;
        },
        setBlur(state, blur){
            state.blur = blur;
        },
        setTitle(state, isTitleFound) {
            state.title = isTitleFound;
        },
        setArtist(state, isArtistFound) {
            state.artist = isArtistFound;
        },
        setCount(state, numberOfSeconds) {
            state.count = numberOfSeconds;
        },
        setCountMax(state, maxNumberOfSeconds) {
            state.countMax = maxNumberOfSeconds;
        },
        decrementCount(state){
            state.count -= 1;
        },
        setRequestSpotifyAuth(state, resquestSpotifyAuth) {
            state.requestSpotifyAuth = resquestSpotifyAuth;
        },
        setSpotifyMessage(state, spotifyMessage) {
            state.spotifyMessage = spotifyMessage;
        },
    },
    getters: {
        getClicker(state){
            return state.clicker;
        },
        getIsMusicPlaying(state) {
            return state.isMusicPlaying;
        },
        getTitle(state) {
            return state.title;
        },
        getArtist(state) {
            return state.artist;
        },
        getCount(state) {
            return state.count;
        },
        getCountMax(state) {
            return state.countMax;
        },
        getUsers(state) {
            return state.users;
        },
        getRequestSpotifyAuth(state) {
            return state.requestSpotifyAuth;
        },
        getSpotifyMessage(state) {
            return state.spotifyMessage;
        },
    },
    actions:{
        changeModalStatus(context, params){
            context.commit('showModal', params.isShowModal);
            context.commit('setBlur', params.blur);
            context.commit('setClicker', "");
            setDataFirebase(import.meta.env.VITE_FIREBASE_DB_APP + '/isMusicPlaying', params.isMusicPlaying);
        },
        nextTrack(context, timeout = 0){
            let deviceId = context.state.spotifyDeviceId;
            let token = context.state.spotifyToken;
            const requestOptions = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            };

            let url = "https://api.spotify.com/v1/me/player/next?device_id=" + deviceId;

            // On passe à la prochaine musique 10s après que l'artiste et le titre ont été trouvés
            setTimeout(function(){fetchPlus(url, requestOptions, 6, context)}, timeout);

        },
        // Permet de connecter automatiquement l'application à Spotify
        transferSpotifyPlaybackToDevice(context){
            let deviceId = context.state.spotifyDeviceId;
            let token = context.state.spotifyToken;
            let url = "https://api.spotify.com/v1/me/player";
            let body = '{"device_ids":["'+deviceId+'"]}'

            const requestOptions = {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body : body
            };
            fetchPlus(url, requestOptions, 6, context)
        }
    }
})

export default store;
