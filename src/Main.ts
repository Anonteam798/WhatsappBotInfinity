import { MessageTypes } from "whatsapp-web.js";
import { BotController } from "./controller/BotController";
import BotConstants from "./shared/BotConstants";


const botController = new BotController();



botController.initListener();

//Initialize other
BotConstants.seedTypes();
