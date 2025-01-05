import * as THREE from 'three';
import { HandModel, Landmark } from '../types';
import { HandModelService } from './3d/HandModelService';
import { SceneService } from './3d/SceneService';
import { CoordinateService } from './3d/CoordinateService';

export class ThreeDHandService {
  private sceneService: SceneService;
  private handModelService: HandModelService;
  private coordinateService: CoordinateService;
  private arm: THREE.Group;
  private isInitialized: boolean = false;
  private currentModel: HandModel = 'realistic';

  constructor(private container: HTMLDivElement) {
    this.sceneService = new SceneService(container);
    this.handModelService = new HandModelService();
    this.coordinateService = new CoordinateService();
    this.arm = new THREE.Group();
    this.sceneService.getScene().add(this.arm);
  }

  initialize() {
    if (this.isInitialized) return;
    this.createArm();
    this.isInitialized = true;
  }

  private createArm() {
    this.arm = this.handModelService.createArm(this.currentModel, this.sceneService.getScene());
  }

  updateHandModel(model: HandModel) {
    if (this.currentModel !== model) {
      this.currentModel = model;
      this.createArm();
    }
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null) {
    if (!this.isInitialized) return;

    const position = this.coordinateService.calculateArmPosition(elbow, shoulder);
    const rotation = this.coordinateService.calculateArmRotation(elbow, shoulder);

    this.arm.position.copy(position);
    this.arm.rotation.copy(rotation);

    this.sceneService.render();
  }

  setVisible(visible: boolean) {
    if (!this.isInitialized) return;
    this.arm.visible = visible;
    if (visible) {
      this.sceneService.render();
    }
  }

  resize() {
    if (!this.isInitialized) return;
    this.sceneService.resize(this.container.clientWidth, this.container.clientHeight);
  }

  dispose() {
    if (this.isInitialized) {
      this.container.removeChild(this.sceneService.getRenderer().domElement);
      this.sceneService.dispose();
      this.isInitialized = false;
    }
  }
}