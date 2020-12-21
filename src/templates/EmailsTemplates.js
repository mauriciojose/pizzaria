module.exports = {
    templateUm(link){
        return `
                    <style>

                        div.container-email div.body-email div.button-confirm button:hover{
                            background-color: lightseagreen;
                            color: white;
                            border: 1px solid #e7e6e6;
                        }
                        
                    </style>
                <div style='font-family: Candara, Calibri, Segoe, "Segoe UI", Optima, Arial, sans-serif; font-weight: 400; font-size: 15px; background: #f0f0f5; -webkit-font-smoothing: antialiased; width: 100%; height: 100vh; display: block; align-items: center; justify-content: center;'>
                    <div style='margin: 0 auto;width: 72%; height: 100%; background-color: white; -webkit-box-shadow: 2px 2px 78px -35px rgba(0,0,0,0.75); -moz-box-shadow: 2px 2px 78px -35px rgba(0,0,0,0.75); box-shadow: 2px 2px 78px -35px rgba(0,0,0,0.75);'>
                        <div style='width: 100%; display: block; block-direction: column; align-items: center; justify-content: center; padding: 30px 0 0 0;'>
                            <div style='text-align:center;width: 100%; font-size: 2.1em; color: lightseagreen; display: block; align-items: center; justify-content: center;'>
                                <span style='/*margin-left: 19%;*/'>Verificação de E-mail</span>
                            </div>
                            <div style='width: 100%; font-size: 2.1em; color: lightseagreen; display: block; align-items: center; justify-content: center; text-align: center;'>
                                <img src="https://drive.google.com/uc?export=view&id=17U8qNV7trkztKYxwEJ1uvqgtyrsD03u9" alt="" style='width: 42%;'>
                            </div>
                            <div style='width: 100%; display: block; align-items: center; justify-content: center; padding: 4% 0 0 0;text-align: center;'>
                                <span style='width: 100%; font-size: 1.8em; color: #222222; text-align: center; line-height: 30px;'>Por favor, confirme o seu endereço de e-mail</span>
                            </div>
                            <div style='width: 100%; display: block; align-items: center; justify-content: center; padding: 4% 0 0 0;text-align: center;'>
                                <span style='width: 100%; font-size: 1.25em; color: #222222; text-align: center; line-height: 20px; color: #4F4F4F;'>Para verificar que este endereço de e-mail pertence a você, clique no botão abaixo:</span>
                            </div>
                            <div style='width: 100%; text-align: center;margin-top: 4%;'>
                                <a href="${link}" target="_blank" rel="noopener noreferrer">
                                    <button style='width: 98%;cursor: pointer;background-color: lightseagreen; color: white; border: 1px solid #e7e6e6; padding: 2% 5%; font-size: 20px; border-radius: 5px; transition: background-color 0.3s linear 0.1s, color 0.3s linear 0.1s;'>Confirmar E-mail</button>
                                </a>
                            </div>
                        </div>
                        <div style='height: 100%;width: 100%; border-top: 1px solid #cdcdcd; margin-top: 7%; background-color: #f0eeee; display: block; justify-content: center; align-items: center;'>
                            <div style='width: 50%;float:left; display: block; justify-content: center; align-items: center; block-direction: column;'>
                                <h3 style='text-align: center;'>Sobre</h3>
                                <span style='color: #4F4F4F;'>Verificação de endereço de e-mail.</span>
                            </div>
                            <div style='width: 50%;float:left; display: block; justify-content: center; align-items: center; block-direction: column;'>
                                <h3 style='text-align: center;'>Contato</h3>
                                <span style='color: #4F4F4F;'>mauricio.si.servico@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    }
}