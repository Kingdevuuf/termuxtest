<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../api';
import { useAuth } from '../stores/auth';
import PasswordInput from '../components/PasswordInput.vue';
const auth=useAuth(); const router=useRouter(); const i18n=useI18n();
const langOpen=ref(false), pwOpen=ref(false), logoutOpen=ref(false), copied=ref(false);
const langs=[['en','English'],['hi','हिन्दी'],['ta','தமிழ்'],['te','తెలుగు']];
const old=ref(''), nw=ref(''), msg=ref('');
async function setLang(l){ i18n.locale.value=l; localStorage.setItem('lang',l); langOpen.value=false; try{ await api.post('/profile',{language:l}); }catch{} }
async function changePw(){ try{ await api.post('/profile',{old_password:old.value,new_password:nw.value}); msg.value='Updated!'; setTimeout(()=>{pwOpen.value=false;msg.value='';},1200); }catch(e){ msg.value=e.response?.data?.error||'Failed'; } }
function copy(){ navigator.clipboard.writeText(auth.user.referral_code); copied.value=true; setTimeout(()=>copied.value=false,1500); }
function doLogout(){ auth.logout(); router.push('/login'); }
</script>
<template>
  <div style="padding-top:12px">
    <div class="div" style="text-align:center">
      <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0095f6,#7c3aed);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:800">{{ auth.user?.fullname?.[0] }}</div>
      <h3>{{ auth.user?.fullname }}</h3>
      <small style="color:#666">@{{ auth.user?.username }}</small>
    </div>
    <div class="div">
      <strong>{{ $t('referralCode') }}</strong>
      <div style="display:flex;gap:8px;margin-top:8px">
        <code style="flex:1;background:#f3f4f6;padding:10px;border-radius:6px">{{ auth.user?.referral_code }}</code>
        <button class="btn ghost" style="width:auto;padding:8px 14px" @click="copy">{{ copied?$t('copied'):$t('copy') }}</button>
      </div>
    </div>
    <div class="div" style="padding:0">
      <a @click="langOpen=true" style="display:block;padding:14px;border-bottom:1px solid #eee;cursor:pointer">🌐 {{ $t('language') }}</a>
      <a @click="pwOpen=true" style="display:block;padding:14px;border-bottom:1px solid #eee;cursor:pointer">🔒 {{ $t('changePassword') }}</a>
      <a @click="logoutOpen=true" style="display:block;padding:14px;color:#ef4444;cursor:pointer">⏻ {{ $t('logout') }}</a>
    </div>

    <div v-if="langOpen" class="popup-bg" @click.self="langOpen=false">
      <div class="popup">
        <h3>{{ $t('language') }}</h3>
        <div v-for="[c,n] in langs" :key="c" @click="setLang(c)" style="padding:12px;border-bottom:1px solid #eee;cursor:pointer">{{ n }}</div>
      </div>
    </div>
    <div v-if="pwOpen" class="popup-bg" @click.self="pwOpen=false">
      <div class="popup">
        <h3>{{ $t('changePassword') }}</h3>
        <PasswordInput v-model="old" :label="$t('currentPassword')"/>
        <PasswordInput v-model="nw" :label="$t('newPassword')"/>
        <p v-if="msg" style="text-align:center;color:#0095f6;font-size:13px">{{ msg }}</p>
        <div class="row"><button class="btn ghost" @click="pwOpen=false">Cancel</button><button class="btn" @click="changePw">{{ $t('save') }}</button></div>
      </div>
    </div>
    <div v-if="logoutOpen" class="popup-bg" @click.self="logoutOpen=false">
      <div class="popup">
        <h3>{{ $t('logout') }}?</h3>
        <p style="color:#666;font-size:14px;margin-top:8px">Are you sure you want to logout?</p>
        <div class="row"><button class="btn ghost" @click="logoutOpen=false">Cancel</button><button class="btn red" @click="doLogout">{{ $t('logout') }}</button></div>
      </div>
    </div>
  </div>
</template>
