<input v-model="input1" value={{input1}}/>
<input v-model="input2" :value="input2" />
<input v-model="input3" v-bind:value="input3" />

<input v-model="input1"
    @input.capture="fn('@input.capture')"
    @input.once="fn('@input.once')"/>

<input
    v-model="input1"
    @input="fn('@input')"/>

<input v-model="input3" bindinput="fn"/>

<input v-model="input3" onInput="fn"/>
