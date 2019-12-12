//describe sirve para agrupar un conjunto de casos de prueba
//se estructuran siempre con llamadas de callback
describe ("Hello World Test", () =>{

    //se describe cada "caso de prueba" dentro del callback de la funcion it,
    it ("Should do a test",() => {
        //codigo que se va a testear
        const a=5;
        const b=3;
        const sum = a + b;

        //prueba en la que se define el valor que normalmente esperamos del codigo a probar
        expect(sum).toBe(8);
    });
});